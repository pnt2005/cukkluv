from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib import messages
from accounts.forms import RegisterForm

def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Login success')
            return redirect('home')
    else:
        form = RegisterForm()
        return render(request, 'accounts/register.html', {'form': form})