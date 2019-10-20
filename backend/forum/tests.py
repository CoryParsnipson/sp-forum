from urllib.parse import urlencode

from django.test import Client, TestCase
from django.urls import reverse

from forum.models import Forum, Post, Thread

# TODO: create these unit tests
#   Some unit test involving the new thread creation form
#   Selenium test to check if making new threads is working
#   Selenium test to check if making new posts is working

class TestPost(TestCase):
    """
    Regression suite to test out the forum post REST API
    """

    def setUp(self):
        # create client stand-in
        self.client = Client()

        # create forum and thread objects
        self.forum = Forum.objects.create(title="Forum0", description="Automatically generated forum.")
        self.thread = Thread.objects.create(title="Thread0", author=None, forum=self.forum)

    def test_anonymous_user_post_api_latest(self):
        """
        Send a POST request to create a new Post object.
        """
        original_post_count = len(Post.objects.all())

        post_data = urlencode({
            'content': "This is a test post.",
            'thread': str(self.thread.id)
        })

        response = self.client.post(
            path=reverse('api:post-list'),
            content_type="application/x-www-form-urlencoded; charset=UTF-8",
            data=post_data
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(Post.objects.all()), original_post_count + 1)

    def test_anonymous_user_post_api_v1(self):
        """
        Send a POST request to create a new Post object. Use the specific
        'api-v1' namespace when resolving URL names.
        """
        original_post_count = len(Post.objects.all())

        post_data = urlencode({
            'content': "This is a test post.",
            'thread': str(self.thread.id)
        })

        response = self.client.post(
            path=reverse('api-v1:post-list'),
            content_type="application/x-www-form-urlencoded; charset=UTF-8",
            data=post_data
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(Post.objects.all()), original_post_count + 1)
