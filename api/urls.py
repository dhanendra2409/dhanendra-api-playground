from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import register_user, login_user, logout_user, get_me, CollectionViewSet, ApiRequestViewSet

router = DefaultRouter()
router.register(r'collections', CollectionViewSet, basename='collection')
router.register(r'requests', ApiRequestViewSet, basename='request')

urlpatterns = [
    path('auth/register/', register_user, name='register'),
    path('auth/login/', login_user, name='login'),
    path('auth/logout/', logout_user, name='logout'),
    path('auth/me/', get_me, name='me'),
    path('', include(router.urls)),
]
