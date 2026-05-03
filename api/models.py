from django.db import models
from django.contrib.auth.models import User

class Collection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='collections')
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} - {self.user.username}"

class ApiRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='api_requests')
    method = models.CharField(max_length=10)
    url = models.TextField()
    headers = models.JSONField(default=dict, blank=True)
    body = models.TextField(blank=True, default="")
    response = models.JSONField(null=True, blank=True)
    is_favorite = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.method} {self.url} - {self.user.username}"
