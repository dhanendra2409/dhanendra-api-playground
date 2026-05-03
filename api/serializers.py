from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Collection, ApiRequest

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

class CollectionSerializer(serializers.ModelSerializer):
    request_count = serializers.SerializerMethodField()

    class Meta:
        model = Collection
        fields = ['id', 'name', 'request_count']
        read_only_fields = ['id', 'request_count']

    def get_request_count(self, obj):
        # We can also add a count of requests specifically in this collection if needed
        # Or just return 0 or total requests for the user. For compatibility with the fronted:
        return 0

class ApiRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApiRequest
        fields = ['id', 'method', 'url', 'headers', 'body', 'response', 'is_favorite', 'timestamp']
        read_only_fields = ['id', 'timestamp']
