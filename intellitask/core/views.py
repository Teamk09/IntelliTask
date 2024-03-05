from django.shortcuts import render, redirect
from django.contrib.auth import login
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

class Login(LoginView):
    template_name = 'login.html'
    redirect_field_name = 'task_list'  # Redirect to task list after login

@login_required
def task_create(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            print("DEBUG: request.user:", request.user)
            print("DEBUG: request.user.id:", request.user.id)
            new_task = form.save(commit=False)
            new_task.user_id = 2  # Assign the user's ID
            new_task.save()
            return redirect('task_list')
    else:
        form = TaskForm()
    return render(request, 'task_create.html', {'form': form})


@login_required
def task_list(request):
    print("User:", request.user)
    print("Is Authenticated:", request.user.is_authenticated)
    if request.user.is_authenticated:
        print(request.user) # debugging
        print(type(request.user)) # debugging
        print(request.user.id) # debugging
        tasks = Task.objects.filter(user_id=request.user.id)
        return render(request, 'task_list.html', {'tasks': tasks, 'user': request.user})
    else:
        pass


