# Generated by Django 2.2.4 on 2019-09-03 23:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('forum', '0002_forum_post_thread'),
    ]

    operations = [
        migrations.AddField(
            model_name='forum',
            name='description',
            field=models.CharField(default='Generic forum description', max_length=500),
        ),
        migrations.AddField(
            model_name='forum',
            name='name',
            field=models.CharField(default='Forum', max_length=150),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='post',
            name='thread',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='forum.Thread'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='thread',
            name='forum',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='forum.Forum'),
            preserve_default=False,
        ),
    ]
