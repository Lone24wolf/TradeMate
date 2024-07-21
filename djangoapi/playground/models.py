from django.db import models
from django.utils import timezone
import datetime
# Create your models here.
class User(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)

class History(models.Model):
    email = models.EmailField()
    date = models.DateField(default=timezone.now)
    time = models.TimeField(default=timezone.now)
    csv_file = models.FileField(upload_to='csv_files/')
    stock_symbols = models.JSONField(default=list)

