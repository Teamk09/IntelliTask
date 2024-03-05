from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True, blank=True, null=True)
    groups = models.ManyToManyField(
        'auth.Group',
        blank=True,
        help_text='',
        related_name="myapp_user_set",
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="myapp_user_set",
        verbose_name='user permissions'
    )

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
