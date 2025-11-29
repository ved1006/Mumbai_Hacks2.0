import time
import random
import threading
import logging
from .database import get_all_hospitals, update_hospital_data, get_incoming_patient_count
from .ai_model import predict_congestion

logger = logging.getLogger(__name__)

class HospitalSimulation:
    def __init__(self, interval=5):
        self.interval = interval
        self.running = False
        self.thread = None

    def start(self):
        if not self.running:
            self.running = True
            self.thread = threading.Thread(target=self._run_loop, daemon=True)
            self.thread.start()
            logger.info("Hospital simulation started.")

    def stop(self):
        self.running = False
        if self.thread:
            self.thread.join()
            logger.info("Hospital simulation stopped.")

    def _run_loop(self):
        while self.running:
            try:
                self._simulate_step()
                time.sleep(self.interval)
            except Exception as e:
                if "no such table" in str(e):
                    logger.warning("Database not ready yet, waiting...")
                    time.sleep(2) # Wait longer if DB is missing
                else:
                    logger.error(f"Error in simulation loop: {e}")
                    time.sleep(self.interval)

    def _simulate_step(self):
        hospitals = get_all_hospitals()
        
        for hospital in hospitals:
            # Simulate random changes
            changes = {}
            
            # Get real incoming patients count (from last 60 mins)
            incoming_patients = get_incoming_patient_count(hospital['hospital_id'])
            
            # 1. Random Admissions/Discharges
            if random.random() < 0.3: # 30% chance of change
                change = random.randint(-2, 3) # -2 to +3 patients
                new_admissions = max(0, hospital['er_admissions'] + change)
                changes['er_admissions'] = new_admissions
                
            # 2. Bed Availability changes
            if 'er_admissions' in changes:
                diff = changes['er_admissions'] - hospital['er_admissions']
                # Calculate potential new beds
                potential_beds = hospital['bed_availability'] - diff
                
                # CONSTRAINT: Beds cannot drop below incoming_patients
                # If we have 5 incoming, we must keep 5 beds.
                # Actually, if we have 5 incoming, and we currently have 10 beds, we can go down to 5.
                # If we have 4 beds and 5 incoming, we are already in trouble, but let's just clamp to 0 at least.
                # But the user said "should not show less than 6 beds" if 6 are expected.
                # So we force bed_availability >= incoming_patients if possible.
                # But we can't magically create beds if they are already occupied.
                # However, this is a simulation of *availability*.
                # So we should ensure the *random fluctuation* doesn't push it below incoming.
                
                min_beds = incoming_patients
                new_beds = max(min_beds, min(hospital['total_beds'], potential_beds))
                
                changes['bed_availability'] = new_beds
                
            # 3. Ambulance Arrivals
            if random.random() < 0.2:
                new_ambulances = max(0, hospital['ambulance_arrivals'] + random.randint(-1, 2))
                changes['ambulance_arrivals'] = new_ambulances

            # 4. Update Status based on AI Prediction
            if changes:
                # Merge current state with changes for prediction
                current_state = {**hospital, **changes}
                predicted_load = predict_congestion(current_state)
                
                if predicted_load > 150: # Threshold from requirements
                    changes['status'] = 'Red'
                elif predicted_load > 100:
                    changes['status'] = 'Yellow'
                else:
                    changes['status'] = 'Green'
                
                update_hospital_data(hospital['hospital_id'], changes)
                logger.debug(f"Updated {hospital['hospital_name']}: {changes}")

simulation = HospitalSimulation()
