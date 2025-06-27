from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Candidature

# Create your views here.

class CandidatureListView(generics.ListAPIView):
    queryset = Candidature.objects.all()
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        return Response({'message': 'Not implemented yet'})

class CandidatureDetailView(generics.RetrieveAPIView):
    queryset = Candidature.objects.all()
    permission_classes = [IsAuthenticated]
    
    def retrieve(self, request, *args, **kwargs):
        return Response({'message': 'Not implemented yet'})

class CandidatureCreateView(generics.CreateAPIView):
    queryset = Candidature.objects.all()
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        return Response({'message': 'Not implemented yet'})

class CandidatureAcceptView(generics.UpdateAPIView):
    queryset = Candidature.objects.all()
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, *args, **kwargs):
        return Response({'message': 'Not implemented yet'})

class CandidatureRejectView(generics.UpdateAPIView):
    queryset = Candidature.objects.all()
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, *args, **kwargs):
        return Response({'message': 'Not implemented yet'})

class CandidatureWithdrawView(generics.UpdateAPIView):
    queryset = Candidature.objects.all()
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, *args, **kwargs):
        return Response({'message': 'Not implemented yet'})
