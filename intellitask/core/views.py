from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.views import LoginView
from django.contrib.auth.decorators import login_required
from .forms import SignUpForm, TaskForm
from .models import Task
from django.contrib.auth.models import User

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

class Login(LoginView):
    template_name = 'login.html'
    redirect_field_name = 'task_list'  # Redirect to task list after login

@login_required  # Ensure only logged-in users can create tasks
def task_create(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            new_task = form.save(commit=False)  # Don't save just yet
            new_task.user = request.user  # Link to the logged-in user
            new_task.save()
            return redirect('task_list')  # Redirect to task list on success
    else:
        form = TaskForm()
    return render(request, 'task_create.html', {'form': form})

@login_required
def task_list(request):
    print("Username:", request.user) # Check what's actually there
    user_obj = User.objects.get(username=request.user)
    tasks = Task.objects.filter(user=user_obj).order_by('deadline')
    return render(request, 'task_list.html', {'tasks': tasks})