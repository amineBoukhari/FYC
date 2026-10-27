---
title: Météo Locale
summary: Application web progressive (PWA) de prévisions météo, installable et utilisable hors ligne.
year: 2024
role: Projet personnel
stack: [Svelte, Service Worker, Open-Meteo]
cover: /images/projets/meteo-locale.jpg
coverAlt: Aperçu stylisé du code source de Météo Locale
---

## Contexte

Un projet personnel pour explorer les Service Workers et le fonctionnement hors ligne des applications web.

## Ce que j'ai réalisé

- Prévisions horaires et sur 7 jours à partir de l'API ouverte Open-Meteo.
- Mise en cache des dernières prévisions pour une consultation hors connexion.
- Application installable sur mobile grâce au manifeste web.

## Ce que j'en retiens

Le cache est un outil puissant, mais il faut une stratégie claire d'invalidation : une prévision météo périmée est pire qu'une absence de prévision.
