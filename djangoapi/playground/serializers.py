from rest_framework import serializers
from playground.models import User
from playground.models import History

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email','password') 


class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = ['email', 'date', 'time', 'csv_file', 'stock_symbols']

