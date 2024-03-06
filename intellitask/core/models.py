from django.db import models
from django.contrib.auth.models import User

# Task Model
class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=250)
    description = models.TextField(blank=True, null=True)
    deadline = models.DateTimeField()
    importance_level = models.IntegerField(choices=[(1, 'Low'), (2, 'Medium'), (3, 'High')])
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    priority_score = models.IntegerField(blank=True, null=True)  # Keep for calculation later
