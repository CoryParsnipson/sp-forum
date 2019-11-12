import json

from django.contrib.auth.models import AbstractUser
from django.db import models

import forum.lib as lib

class User(AbstractUser):
    pass


class Forum(models.Model):
    """
    A partition to group discussion topics together.
    """

    title = models.CharField(max_length=150, blank=False, null=False)
    slug = models.SlugField(max_length=60, unique=True, editable=False)
    description = models.CharField(max_length=500, default="Generic forum description")

    def save(self, *args, **kwargs):
        if not self.slug:
            lib.unique_slugify(self, self.title)
        super(Forum, self).save(*args, **kwargs)

    def __str__(self):
        return "(" + self.title + ") \"" + self.description + "\""


class Thread(models.Model):
    """
    Forum thread. A single topic of discussion.
    """

    title = models.CharField(max_length=500, blank=False, null=False)
    slug = models.SlugField(max_length=60, unique=True, editable=False)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)

    # TODO: what should behavior be when deleting a forum?
    forum = models.ForeignKey(Forum, on_delete=models.CASCADE, blank=False, null=False)
    published = models.DateTimeField(auto_now_add=True, verbose_name="date published")
    last_updated = models.DateTimeField(auto_now_add=True, verbose_name="date updated")

    def save(self, *args, **kwargs):
        if not self.slug:
            # need to parse title into JSON (because slatejs output is JSON)
            # yes, not very clean, I know...
            title_json = json.loads(self.title)
            lib.unique_slugify(self, title_json['document']['nodes'][0]['nodes'][0]['text'])
        super(Thread, self).save(*args, **kwargs)

    def __str__(self):
        return "(" + self.title + ") [" \
            + (self.author.username if self.author else "Anonymous") + "]"


class Post(models.Model):
    """
    Forum posts.
    """

    MAX_CHAR_LENGTH=50000
    PREVIEW_CHAR_LENGTH=30

    # TODO: on_delete=models.SET(<function to set author field to "deleted user">)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    content = models.TextField(max_length=MAX_CHAR_LENGTH)
    published = models.DateTimeField(auto_now_add=True, verbose_name="date published")

    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, blank=False, null=False)

    def __str__(self):
        model_text = "(" + (self.author.username if self.author else "Anonymous") + ") "
        model_text += self.content if len(self.content) < self.PREVIEW_CHAR_LENGTH \
            else (self.content[:self.PREVIEW_CHAR_LENGTH] + "...")
        return model_text
