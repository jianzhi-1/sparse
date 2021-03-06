from django.db import models
import datetime
from django.utils import timezone

# Create your models here.

class Question(models.Model):
    def __str__(self):
        return self.question_text
    def was_published_recently(self):
        now = timezone.now()
        return now - datetime.timedelta(days=1) <= self.pub_date <= now
    was_published_recently.admin_order_field = 'pub_date'
    was_published_recently.boolean = True
    was_published_recently.short_description = 'Published recently?'
    question_text = models.CharField(max_length = 250)
    pub_date = models.DateTimeField('date published')


class Choice(models.Model):
    def __str__(self):
        return self.choice_text
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)

class NodeNode(models.Model):
    def __str__(self):
        return str(self.long) + " " + str(self.lat)
    long = models.IntegerField(default=0)
    lat = models.IntegerField(default=0)

class Route(models.Model):
    def __str__(self):
        return description + " , taken at " + str(self.t)
    t = models.DateTimeField('date route taken')
    description = models.CharField(max_length = 250)

class DataPoint(models.Model):
    def __str__(self):
        return str(self.long) + " " + str(self.lat)
    long = models.IntegerField(default=0)
    lat = models.IntegerField(default=0)
    question = models.ForeignKey(Route, on_delete=models.CASCADE)
