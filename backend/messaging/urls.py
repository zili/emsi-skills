from django.urls import path
from . import views

app_name = 'messaging'

urlpatterns = [
    # Message endpoints
    path('', views.MessageListView.as_view(), name='message_list'),
    path('send/', views.MessageCreateView.as_view(), name='message_create'),
    path('conversation/<int:user_id>/', views.ConversationView.as_view(), name='conversation'),
] 