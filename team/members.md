---
title: Members
permalink: /team/members/
---

{% assign role_order = "Postdoc,Grad,Undergrad" | split: "," %}
{% assign non_alumni = site.team | where_exp: "m", "m.role != 'Alumni'" %}
{% assign current = non_alumni | where_exp: "m", "m.role != 'PI'" %}
{% assign alumni  = site.team | where: "role", "Alumni" %}

<section class="team-section">
  <h2 class="section-title">Current Members</h2>
  <div class="team-grid">
    {% for role in role_order %}
      {% assign in_role = current | where: "role", role | sort: "order" %}
      {% for member in in_role %}
        {% include team-card.html member=member %}
      {% endfor %}
    {% endfor %}
  </div>
</section>

{% if alumni.size > 0 %}
<section class="team-section">
  <h2 class="section-title">Alumni</h2>
  <div class="team-grid">
    {% assign alumni_sorted = alumni | sort: "order" %}
    {% for member in alumni_sorted %}
      {% include team-card.html member=member %}
    {% endfor %}
  </div>
</section>
{% endif %}
