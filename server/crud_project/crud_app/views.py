from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Book
from .serializer import BookSerializer


@api_view(['GET'])
def get_Books(request):
  """
    Retrieve all books from the database.
    """
  books = Book.objects.all()
  serializerData = BookSerializer(books, many=True).data
  return Response(serializerData, status=status.HTTP_200_OK)


@api_view(['POST'])
def create_Book(request):
  """
    Create a new book in the database.
    """
  data = request.data
  serializer = BookSerializer(data=data)
  if serializer.is_valid():
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)
  return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def book_detail(request, pk):
  """
    Retrieve, update or delete a book from the database.
    """
  try:
    book = Book.objects.get(pk=pk)
  
  except Book.DoesNotExist:
    return Response(status=status.HTTP_404_NOT_FOUND)
  
  if request.method == 'DELETE':
    """
    Delete a book from the database.
    """
    book.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
  
  elif request.method == 'PUT':
    """
    Update a book in the database.
    """
    data = request.data
    serializer = BookSerializer(book, data=data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)