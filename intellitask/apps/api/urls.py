from django.urls import path
from . import views

urlpatterns = [
    path('api/tasks/', views.api_task_list, name='api_task_list'),
    path('api/tasks/<int:pk>/', views.task_detail, name='task_detail'),
]