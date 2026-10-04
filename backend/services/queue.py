import time
from typing import Dict, Any, Optional

class JobQueueManager:
    def __init__(self):
        self.jobs: Dict[str, Dict[str, Any]] = {}
        self.queue_order = []

    def create_job(self, job_id: str, model_id: str, prompt: str, params: dict) -> dict:
        job = {
            "job_id": job_id,
            "model_id": model_id,
            "prompt": prompt,
            "params": params,
            "status": "QUEUED",
            "stage": "QUEUED",
            "progress": 0,
            "created_at": time.time(),
            "updated_at": time.time(),
            "started_at": None,
            "completed_at": None,
            "video_url": None,
            "thumbnail_url": None,
            "error": None,
        }
        self.jobs[job_id] = job
        self.queue_order.append(job_id)
        return job

    def update_job(self, job_id: str, **kwargs):
        if job_id in self.jobs:
            self.jobs[job_id].update(kwargs)
            self.jobs[job_id]["updated_at"] = time.time()

    def get_job(self, job_id: str) -> Optional[dict]:
        return self.jobs.get(job_id)

    def cancel_job(self, job_id: str) -> bool:
        if job_id in self.jobs:
            self.jobs[job_id]["status"] = "CANCELLED"
            self.jobs[job_id]["stage"] = "CANCELLED"
            return True
        return False

    def get_queue_metrics(self) -> dict:
        total = len(self.jobs)
        active = sum(1 for j in self.jobs.values() if j["status"] in ["LOADING_MODEL", "GENERATING", "PROCESSING"])
        queued = sum(1 for j in self.jobs.values() if j["status"] == "QUEUED")
        completed = sum(1 for j in self.jobs.values() if j["status"] == "COMPLETED")
        failed = sum(1 for j in self.jobs.values() if j["status"] == "FAILED")

        return {
            "total_jobs": total,
            "active_jobs": active,
            "queued_jobs": queued,
            "completed_jobs": completed,
            "failed_jobs": failed,
        }

queue_manager = JobQueueManager()
