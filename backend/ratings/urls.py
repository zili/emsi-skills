from django.urls import path
from . import views

app_name = 'ratings'

urlpatterns = [
    # Rating endpoints
    path('', views.RatingListView.as_view(), name='rating_list'),
    path('create/', views.RatingCreateView.as_view(), name='rating_create'),
    path('user/<int:user_id>/', views.UserRatingsView.as_view(), name='user_ratings'),
] 