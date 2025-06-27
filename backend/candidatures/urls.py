from django.urls import path
from . import views

app_name = 'candidatures'

urlpatterns = [
    # Candidature endpoints
    path('', views.CandidatureListView.as_view(), name='candidature_list'),
    path('<int:pk>/', views.CandidatureDetailView.as_view(), name='candidature_detail'),
    path('apply/<int:project_id>/', views.CandidatureCreateView.as_view(), name='candidature_create'),
    
    # Actions
    path('<int:pk>/accept/', views.CandidatureAcceptView.as_view(), name='candidature_accept'),
    path('<int:pk>/reject/', views.CandidatureRejectView.as_view(), name='candidature_reject'),
    path('<int:pk>/withdraw/', views.CandidatureWithdrawView.as_view(), name='candidature_withdraw'),
] 