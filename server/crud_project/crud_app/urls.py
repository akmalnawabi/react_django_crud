from django.urls import path
from .views import get_Books, create_Book

urlpatterns = [
  path('books/', get_Books, name='get_Books'),
  path('books/create/', create_Book, name='create_Book'),
] 