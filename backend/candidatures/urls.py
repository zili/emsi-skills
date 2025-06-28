from django.urls import path
from . import views

app_name = 'candidatures'

urlpatterns = [
    # Candidature endpoints
    path('', views.CandidatureListView.as_view(), name='candidature_list'),
    path('<int:pk>/', views.CandidatureDetailView.as_view(), name='candidature_detail'),
    path('create/', views.CandidatureCreateView.as_view(), name='candidature_create'),
    
    # Actions sur les candidatures
    path('<int:pk>/accept/', views.CandidatureAcceptView.as_view(), name='candidature_accept'),
    path('<int:pk>/reject/', views.CandidatureRejectView.as_view(), name='candidature_reject'),
    path('<int:pk>/withdraw/', views.CandidatureWithdrawView.as_view(), name='candidature_withdraw'),
    
    # Utilitaires
    path('check/<int:project_id>/', views.check_candidature_status, name='check_candidature_status'),
    path('project/<int:project_id>/', views.project_candidatures, name='project_candidatures'),
] 