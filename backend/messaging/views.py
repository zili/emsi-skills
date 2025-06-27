from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Message, Conversation

# Create your views here.

class MessageListView(generics.ListAPIView):
    queryset = Message.objects.all()
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        return Response({'message': 'Not implemented yet'})

class MessageCreateView(generics.CreateAPIView):
    queryset = Message.objects.all()
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        return Response({'message': 'Not implemented yet'})

class ConversationView(generics.ListAPIView):
    queryset = Conversation.objects.all()
    permission_classes = [IsAuthenticated]
    
    def list(self, request, *args, **kwargs):
        return Response({'message': 'Not implemented yet'})
