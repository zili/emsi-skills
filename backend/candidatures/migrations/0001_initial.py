# Generated by Django 4.2.7 on 2025-06-28 20:11

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('projects', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Candidature',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cover_letter', models.TextField(help_text='Lettre de motivation')),
                ('motivation_message', models.TextField(blank=True)),
                ('proposed_timeline', models.CharField(blank=True, max_length=100)),
                ('proposed_budget', models.CharField(blank=True, max_length=100)),
                ('availability', models.CharField(help_text='Disponibilité du candidat', max_length=200)),
                ('display_name', models.CharField(blank=True, max_length=100)),
                ('candidate_photo', models.ImageField(blank=True, null=True, upload_to='candidate_photos/')),
                ('formatted_date', models.CharField(blank=True, max_length=20)),
                ('status', models.CharField(choices=[('pending', 'En attente'), ('accepted', 'Acceptée'), ('rejected', 'Rejetée'), ('withdrawn', 'Retirée')], default='pending', max_length=20)),
                ('applied_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('reviewed_at', models.DateTimeField(blank=True, null=True)),
                ('rejection_reason', models.TextField(blank=True)),
                ('relevant_experience', models.TextField(blank=True, help_text='Expérience pertinente')),
                ('portfolio_links', models.TextField(blank=True, help_text='Liens vers portfolio/travaux précédents')),
                ('candidate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='candidatures', to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='candidatures', to='projects.project')),
                ('reviewed_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='reviewed_candidatures', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-applied_at'],
                'unique_together': {('project', 'candidate')},
            },
        ),
        migrations.CreateModel(
            name='CandidatureFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='candidature_files/')),
                ('name', models.CharField(max_length=200)),
                ('description', models.CharField(blank=True, max_length=500)),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('candidature', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='files', to='candidatures.candidature')),
            ],
        ),
    ]
