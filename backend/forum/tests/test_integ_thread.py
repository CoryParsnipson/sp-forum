import time

from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.action_chains import ActionChains

from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from django.urls import reverse

from forum.models import Forum, Post, Thread

NEW_THREAD_EDITOR_AREA = "new-thread-editor"
POST_LIST_CLASS = "posts_list"

class IntegThreadTests(StaticLiveServerTestCase):
    """
    Integration tests using Selenium to check if the end-to-end REST API
    post flow works.
    """

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.selenium = WebDriver(executable_path='vendor/chromedriver')
        cls.selenium.implicitly_wait(0.5)

        # data setup
        cls.forum = Forum.objects.create(title="Forum0", description="Automatically generated forum.")

        # for actions that aren't directed towards a specific WebElement
        cls.actions = ActionChains(cls.selenium)

    @classmethod
    def tearDownClass(cls):
        cls.selenium.quit()
        super().tearDownClass()

    def test_anonymous_user_thread(self):
        """
        Test if submitting a post while in the Create New Thread page will create
        a new thread and post.
        """

        TEST_STRING = 'Are you guid-flender? Are you jewish-fluidly? Fluid jewish??'

        self.selenium.get('%s%s' % (
            self.live_server_url,
            reverse('forum:thread-new-form', kwargs = {
                'forum_slug': self.forum.slug,
            })
        ))

        # type into editor
        editor_element = self.selenium.find_element_by_css_selector(
            "#%s p.content" % (NEW_THREAD_EDITOR_AREA)
        )
        editor_element.click()
        self.actions.send_keys(TEST_STRING).perform()

        # submit post
        editor_submit = self.selenium.find_element_by_css_selector(
            "#%s button[type=submit]" % (NEW_THREAD_EDITOR_AREA)
        )
        editor_submit.click()

        # need to wait until AJAX request comes back
        time.sleep(0.1)

        # detect if thread id has been set by successful thread API call
        thread_id_element = self.selenium.find_element_by_css_selector(
            "#%s input[type=hidden][name=thread]" % (NEW_THREAD_EDITOR_AREA)
        )
        self.assertTrue(bool(thread_id_element.get_attribute("value")))

        # detect if new post was successfully added
        new_post = self.selenium.find_element_by_css_selector(
            "table.%s tr:nth-last-child(2)" % (POST_LIST_CLASS)
        )
        new_post_content = new_post.find_element_by_css_selector(
            "td.posts_list_data p.content"
        )
        self.assertEqual(TEST_STRING, new_post_content.text)

