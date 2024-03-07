from rest_framework import serializers
from apps.core.models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'deadline', 'importance_level', 'is_completed')
        read_only_fields = ('id',)  # Don't allow client to set ID

