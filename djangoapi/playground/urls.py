from playground import views

from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user), 
    path('predict/',views.predict_stocks)
    # path('add/', views.add_person)
     
      # Example API endpoint
    # path('admin/', admin.site.urls),  # Admin interface URLs
    # Additional custom URL patterns for your application
]