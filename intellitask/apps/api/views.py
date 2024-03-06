from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.core.models import Task
from .serializers import TaskSerializer

@api_view(['GET', 'POST'])
def api_task_list(request):
    if request.method == 'GET':
        if request.user.is_authenticated:  # Check if user is authenticated
            tasks = Task.objects.filter(user=request.user)  # Filter by logged-in user
            serializer = TaskSerializer(tasks, many=True)
            return Response(serializer.data)
        else:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    elif request.method == 'POST':
        if request.user.is_authenticated:  # Check if user is authenticated
            serializer = TaskSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user) # Assign the user
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET', 'PUT', 'DELETE'])
def task_detail(request, pk):
    """
    Retrieve, update or delete a specific task.
    """
    try:
        task = Task.objects.get(pk=pk, user=request.user) # Enforce ownership
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = TaskSerializer(task, data=request.data)
        if serializer.is_valid():
            serializer.save() # Update existing task
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)