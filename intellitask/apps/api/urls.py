from django.urls import path
from . import views

urlpatterns = [
    path('api/tasks/', views.api_task_list, name='api_task_list'),
    path('api/tasks/<int:pk>/', views.task_detail, name='task_detail'),
    path('api/login/', views.api_login_view, name='api_login_view'),
    path('api/logout/', views.api_logout_view, name='api_logout_view'),
    path('api/signup/', views.api_signup_view, name='api_signup_view'),
]