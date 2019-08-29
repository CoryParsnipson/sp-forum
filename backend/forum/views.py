from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.
def index(request):
    return render(request, 'forum/index.html')

def post_detail(request):
    data = {
        'contents' : request.POST['post_contents']
    };
    return JsonResponse(data);
