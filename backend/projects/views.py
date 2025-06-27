from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Project, Category
from .serializers import ProjectSerializer, CategorySerializer

# Create your views here.

class ProjectListView(generics.ListAPIView):
    """Liste des projets - nécessite une authentification"""
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

class PublicProjectsView(generics.ListAPIView):
    """Vue publique des projets approuvés pour la page d'accueil"""
    queryset = Project.objects.filter(status='approved')
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]

class ProjectCreateView(generics.CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

class ProjectDetailView(generics.RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]  # Permettre l'accès sans authentification

class ProjectUpdateView(generics.UpdateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

class ProjectDeleteView(generics.DestroyAPIView):
    queryset = Project.objects.all()
    permission_classes = [IsAuthenticated]

class MyProjectsView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Project.objects.filter(client=self.request.user)

class ProjectApproveView(generics.UpdateAPIView):
    queryset = Project.objects.all()
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, *args, **kwargs):
        return Response({'message': 'Not implemented yet'})

class ProjectRejectView(generics.UpdateAPIView):
    queryset = Project.objects.all()
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, *args, **kwargs):
        return Response({'message': 'Not implemented yet'})

class ProjectStatsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({'message': 'Not implemented yet'})

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]  # Permettre l'accès sans authentification
