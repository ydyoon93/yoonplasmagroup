---
title: Publications
permalink: /publications/
---

{% assign by_year = site.publications | sort: "date" | reverse | group_by: "year" %}
{% assign by_year_sorted = by_year | sort: "name" | reverse %}

{% if by_year_sorted.size == 0 %}
<p class="muted">No publications listed yet.</p>
{% endif %}

{% for year_group in by_year_sorted %}
  <section class="pub-year-section">
    <h2 class="pub-year">{{ year_group.name }}</h2>
    <ul class="pub-list">
      {% for pub in year_group.items %}
        {%- assign primary_link = nil -%}
        {%- if pub.doi -%}{%- assign primary_link = pub.doi | prepend: "https://doi.org/" -%}
        {%- elsif pub.link -%}{%- assign primary_link = pub.link -%}
        {%- elsif pub.arxiv -%}{%- assign primary_link = pub.arxiv | prepend: "https://arxiv.org/abs/" -%}
        {%- endif -%}
        <li class="pub-item" id="{{ pub.slug }}">
          <div class="pub-title">{{ pub.title }}</div>
          <div class="pub-authors">{{ pub.authors }}</div>
          <div class="pub-meta">
            {% if primary_link %}<a href="{{ primary_link }}">{% endif %}{{ pub.journal }}{% if pub.volume %} <strong>{{ pub.volume }}</strong>{% endif %}{% if pub.pages %}, {{ pub.pages }}{% endif %} ({{ pub.year }}){% if primary_link %}</a>{% endif %}
          </div>
          {% if pub.arxiv or pub.pdf %}
          <div class="pub-links">
            {% if pub.arxiv %}<a href="https://arxiv.org/abs/{{ pub.arxiv }}">arXiv</a>{% endif %}
            {% if pub.pdf %}<a href="{{ pub.pdf | relative_url }}">PDF</a>{% endif %}
          </div>
          {% endif %}
        </li>
      {% endfor %}
    </ul>
  </section>
{% endfor %}
