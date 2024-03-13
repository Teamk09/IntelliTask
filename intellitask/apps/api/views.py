from apps.core.models import Task
from .serializers import TaskSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

@api_view(['POST'])
def api_signup_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if username and password:
        try:
            user = User.objects.create_user(username=username, password=password)
            return Response({'success': 'User created successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def api_login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_logout_view(request):
    try:
        request.user.auth_token.delete()  # Delete the token
        return Response(status=status.HTTP_200_OK)
    except (AttributeError, ObjectDoesNotExist):
        return Response(status=status.HTTP_404_NOT_FOUND)



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def api_task_list(request):
    if request.method == 'GET':
        auth_header = request.headers.get('Authorization')
        if auth_header:
            token = auth_header.split(' ')[1]
        if request.user.is_authenticated:
            show_completed = request.query_params.get('show_completed', 'false').lower() == 'true'
            if show_completed:
                print("GETTING COMPLETED TASK LIST")
                tasks = Task.objects.filter(user=request.user, is_completed=True)
            else:
                print("GETTING DEFAULT TASK LIST")
                tasks = Task.objects.filter(user=request.user, is_completed=False, is_deleted=False)
            serializer = TaskSerializer(tasks, many=True)
            return Response(serializer.data)
        else:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    elif request.method == 'POST':
        if request.user.is_authenticated:  # Check if user is authenticated
            serializer = TaskSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
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
       serializer = TaskSerializer(task, data=request.data, partial=True)
       if serializer.is_valid():
           if 'is_completed' in request.data and request.data['is_completed']:
               serializer.validated_data['is_deleted'] = True  # Mark for deletion
           serializer.save()
           return Response(serializer.data)
       return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)