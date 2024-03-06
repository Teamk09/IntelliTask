from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.contrib.auth.views import LoginView
from django.contrib.auth.decorators import login_required
from .forms import SignUpForm, TaskForm
from .models import Task

# Create your views here.
def home(request):
    return render(request, "home.html")

def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()  # Handles hashing automatically
            login(request, user)  # Log the user in directly
            return redirect('task_list')  # Some success redirect
    else:
        form = SignUpForm()
    return render(request, 'signup.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('login')

class Login(LoginView):
    template_name = 'login.html'
    redirect_field_name = 'task_list'  # Redirect to task list after login

@login_required
def task_create(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            new_task = form.save(commit=False)  # Don't save to DB yet
            new_task.user = request.user  # Assign the user
            new_task.save()  # Now save to DB
            return redirect('task_list')
    else:
        form = TaskForm()
    return render(request, 'task_create.html', {'form': form})


@login_required
def task_list(request):
    tasks = Task.objects.filter(user_id=request.user.id)
    return render(request, 'task_list.html', {'tasks': tasks, 'user': request.user})



