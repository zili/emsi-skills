from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Rating

# Create your views here.

class RatingListView(generics.ListAPIView):
    queryset = Rating.objects.all()
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        return Response({'message': 'Not implemented yet'})

class RatingCreateView(generics.CreateAPIView):
    queryset = Rating.objects.all()
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        return Response({'message': 'Not implemented yet'})

class UserRatingsView(generics.ListAPIView):
    queryset = Rating.objects.all()
    permission_classes = [IsAuthenticated]
    
    def list(self, request, *args, **kwargs):
        return Response({'message': 'Not implemented yet'})
