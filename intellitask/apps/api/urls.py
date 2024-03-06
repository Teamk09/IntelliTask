from django.urls import path
from . import views

urlpatterns = [
    path('api/tasks/', views.task_list, name='task_list'),
]