from django.urls import path
from . import views
from .views import task_create, task_list

urlpatterns = [
    path("", views.home, name='home'),
    path("signup/", views.signup, name="signup"),
    path("login/", views.Login.as_view(), name="login"),
    path("logout/", views.logout_view, name="logout"),
    path('task/new/', task_create, name='task_create'),
    path('tasks/', task_list, name='task_list'),
]
