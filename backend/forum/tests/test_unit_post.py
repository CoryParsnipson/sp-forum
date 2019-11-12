import json
from urllib.parse import urlencode

from django.test import Client, TestCase
from django.urls import reverse

from forum.models import Forum, Post, Thread

class TestPosts(TestCase):
    """
    Regression suite to test out the forum post REST API
    """

    def setUp(self):
        # create client stand-in
        self.client = Client()

        # hashtag, this is fucking dumb
        thread_title_json = {
            "object": "value",
            "document": {
                "object": "document",
                "data": {},
                "nodes": [
                    {
                        "object": "block",
                        "type": "paragraph",
                        "data": {},
                        "nodes": [
                            {
                                "object": "text",
                                "text": "Thread0",
                                "marks": []
                            }
                        ]
                    }
                ]
            }
        }

        # create forum and thread objects
        self.forum = Forum.objects.create(title="Forum0", description="Automatically generated forum.")
        self.thread = Thread.objects.create(title=json.dumps(thread_title_json), author=None, forum=self.forum)

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


class TestThreads(TestCase):
    """
    Regression suite to test out the forum thread REST API
    """

    def setUp(self):
        # create client stand-in
        self.client = Client()

        # create forum and thread objects
        self.forum = Forum.objects.create(title="Forum0", description="Automatically generated forum.")

    def test_anonymous_user_post_api_latest(self):
        """
        Send a POST request to create a new Thread object
        """
        original_thread_count = len(Thread.objects.all())

        # hashtag, this is fucking dumb
        thread_title_json = {
            "object": "value",
            "document": {
                "object": "document",
                "data": {},
                "nodes": [
                    {
                        "object": "block",
                        "type": "paragraph",
                        "data": {},
                        "nodes": [
                            {
                                "object": "text",
                                "text": "Unit Test Thread (API latest)",
                                "marks": []
                            }
                        ]
                    }
                ]
            }
        }

        post_data = urlencode({
            'title': json.dumps(thread_title_json),
            'forum': str(self.forum.id),
            'content': "This is the OP body.",
        })

        response = self.client.post(
            path = reverse('api:thread-list'),
            content_type = "application/x-www-form-urlencoded; charset=UTF-8",
            data = post_data
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(Thread.objects.all()), original_thread_count + 1)

    def test_anonymous_user_post_api_v1(self):
        """
        Send a POST request to create a new Thread object. Use the specific
        'api-v1' namespace when resolving URL names.
        """
        original_thread_count = len(Thread.objects.all())

        # hashtag, this is fucking dumb
        thread_title_json = {
            "object": "value",
            "document": {
                "object": "document",
                "data": {},
                "nodes": [
                    {
                        "object": "block",
                        "type": "paragraph",
                        "data": {},
                        "nodes": [
                            {
                                "object": "text",
                                "text": "Unit Test Thread (API v1)",
                                "marks": []
                            }
                        ]
                    }
                ]
            }
        }

        post_data = urlencode({
            'title': json.dumps(thread_title_json),
            'forum': str(self.forum.id),
            'content': "This is the OP body.",
        })

        response = self.client.post(
            path = reverse('api-v1:thread-list'),
            content_type = "application/x-www-form-urlencoded; charset=UTF-8",
            data = post_data
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(Thread.objects.all()), original_thread_count + 1)
