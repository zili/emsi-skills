from django.urls import path
from . import views

app_name = 'projects'

urlpatterns = [
    # Project endpoints
    path('', views.ProjectListView.as_view(), name='project_list'),
    path('public/', views.PublicProjectsView.as_view(), name='public_projects'),
    path('pending-admin/', views.PendingProjectsAdminView.as_view(), name='pending_projects_admin'),
    path('create/', views.ProjectCreateView.as_view(), name='project_create'),
    path('<int:pk>/', views.ProjectDetailView.as_view(), name='project_detail'),
    path('<int:pk>/update/', views.ProjectUpdateView.as_view(), name='project_update'),
    path('<int:pk>/delete/', views.ProjectDeleteView.as_view(), name='project_delete'),
    
    # My projects
    path('my-projects/', views.MyProjectsView.as_view(), name='my_projects'),
    path('my-stats/', views.my_project_stats, name='my_project_stats'),
    
    # Admin actions
    path('<int:pk>/approve/', views.ProjectApproveView.as_view(), name='project_approve'),
    path('<int:pk>/reject/', views.ProjectRejectView.as_view(), name='project_reject'),
    
    # Stats
    path('stats/', views.ProjectStatsView.as_view(), name='project_stats'),
    
    # Categories and Tags
    path('categories/', views.CategoryListView.as_view(), name='categories'),
]