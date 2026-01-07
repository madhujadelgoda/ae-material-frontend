import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

  breadcrumbsObs$ = this.breadcrumbs$.asObservable();

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const breadcrumbs = this.buildBreadcrumbs(this.route.root);
        this.breadcrumbs$.next(breadcrumbs);
      });
  }

  private buildBreadcrumbs(route: ActivatedRoute, url = '', crumbs: Breadcrumb[] = []): Breadcrumb[] {
    const children = route.children;

    if (!children.length) return crumbs;

    for (const child of children) {
      const routeURL = child.snapshot.url.map(s => s.path).join('/');
      if (routeURL) url += `/${routeURL}`;

      const label = child.snapshot.data['breadcrumb'];
      if (label) {
        crumbs.push({ label, url });
      }

      return this.buildBreadcrumbs(child, url, crumbs);
    }

    return crumbs;
  }
}
