from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json


@csrf_exempt
@require_http_methods(["GET"])
def health_check(request):
    """Endpoint de vérification de santé du serveur"""
    return JsonResponse({
        'status': 'OK',
        'message': 'Hello World',
        'service': 'EMSI Project Platform API',
        'version': '1.0.0'
    })


@csrf_exempt
@require_http_methods(["GET"])
def api_root(request):
    """Endpoint racine de l'API"""
    return JsonResponse({
        'message': 'Welcome to EMSI Project Platform API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/health',
            'auth': '/api/auth/',
            'projects': '/api/projects/',
            'candidatures': '/api/candidatures/',
            'ratings': '/api/ratings/',
            'messages': '/api/messages/'
        }
    }) 