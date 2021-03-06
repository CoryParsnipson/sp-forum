import time
import json

from selenium.common.exceptions import UnexpectedAlertPresentException
from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.action_chains import ActionChains

from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from django.urls import reverse

from forum.models import Forum, Post, Thread

EDITOR_AREA = "editor-area"
POST_LIST_CLASS = "posts_list"

class IntegPostTests(StaticLiveServerTestCase):
    """
    Integration tests using Selenium to check if the end-to-end REST API
    post flow works.
    """

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.selenium = WebDriver(executable_path='vendor/chromedriver')
        cls.selenium.implicitly_wait(0.5)

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

        # data setup
        cls.forum = Forum.objects.create(title="Forum0", description="Automatically generated forum.")
        cls.thread = Thread.objects.create(title=json.dumps(thread_title_json), author=None, forum=cls.forum)

        # Make dummy thread OP to keep thread invariant (every thread must have at least 1 post)
        p = Post(content="This is the OP.", thread = cls.thread);
        p.save();

    @classmethod
    def tearDownClass(cls):
        cls.selenium.quit()
        super().tearDownClass()

    def test_anonymous_user_post(self):
        """
        Test if clicking on POST in the react component of an existing thread
        successfully creates a new post.
        """

        TEST_STRING = ''

        self.selenium.get('%s%s' % (
            self.live_server_url,
            reverse('forum:thread-detail-by-id', kwargs = {
                'id': self.thread.id
            })
        ))

        # type into editor
        editor_element = self.selenium.find_element_by_css_selector(
            "#%s div" % (EDITOR_AREA)
        )
        editor_element.click()
        ActionChains(self.selenium).send_keys(TEST_STRING).perform()

        # submit post
        editor_submit = self.selenium.find_element_by_css_selector(
            "#%s button[type=submit]" % (EDITOR_AREA)
        )
        editor_submit.click()

        # need to wait until AJAX request comes back
        time.sleep(0.5)

        try:
            new_post = self.selenium.find_element_by_css_selector(
                "table.%s tr:nth-last-child(2)" % (POST_LIST_CLASS)
            )
            new_post_content = new_post.find_element_by_css_selector(
                "td.posts_list_data p"
            )
        except (UnexpectedAlertPresentException):
            pass

