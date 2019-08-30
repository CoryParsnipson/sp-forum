from django.db import models

from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    pass


class Post(models.Model):
    """ Forum posts.
    """

    MAX_CHAR_LENGTH=50000
    PREVIEW_CHAR_LENGTH=30

    # TODO: on_delete=models.SET(<function to set author field to "deleted user">)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    content = models.TextField(max_length=MAX_CHAR_LENGTH)
    published = models.DateTimeField(auto_now_add=True, verbose_name="date published")

    def __str__(self):
        model_text = "(" + (self.author.username if self.author else "Anonymous") + ") "
        model_text += self.content if len(self.content) < self.PREVIEW_CHAR_LENGTH \
            else (self.content[:self.PREVIEW_CHAR_LENGTH] + "...")
        return model_text


class Thread(models.Model):
    pass


class Forum(models.Model):
    pass
