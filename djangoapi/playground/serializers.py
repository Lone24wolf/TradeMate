from rest_framework import serializers
from playground.models import User

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email','password') 

