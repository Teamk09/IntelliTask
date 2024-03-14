from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.core.validators import MinLengthValidator, RegexValidator

class User(AbstractUser):
    username = models.CharField(
        max_length=150,
        unique=True,
        validators=[MinLengthValidator(3)]
    )
    groups = models.ManyToManyField(Group, related_name='api_users')
    user_permissions = models.ManyToManyField(Permission, related_name='api_users')

    def save(self, *args, **kwargs):
        password_regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$'
        password_validator = RegexValidator(
            regex=password_regex,
            message='Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
        )
        password_validator(self.password)
        super().save(*args, **kwargs)