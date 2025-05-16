import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../../../shared/service/supabase/data/supabase.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {

  blogs: any[] = [];
  filteredBlogs: any[] = [];
  selectedFilter: string = 'all';





  constructor(private supabase: SupabaseService,
    private router: Router) { }



  ngOnInit() {
    this.cargarBlog();
  }

  async cargarBlog() {
    try {
      const { data, error } = await firstValueFrom(this.supabase.getBlogsWithUserInfo());
      if (error) {
        console.error('Error fetching blogs:', error);
        alert('Error fetching blogs');
        return;
      }
      this.blogs = data;
      this.filteredBlogs = this.blogs; // Initialize filteredBlogs with all blogs
      console.log('Blogs fetched successfully:', this.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      alert('Error fetching blogs');
    }
  }

  onFilter(event: Event) {
    const target = event.target as HTMLSelectElement;
    const filterValue = target.value;
    this.filterBlogs(filterValue);
  }

  filterBlogs(filterValue: string) {
    this.selectedFilter = filterValue;
    if (filterValue === 'all') {
      this.filteredBlogs = this.blogs;
    } else {
      this.filteredBlogs = this.blogs.filter(blog => blog.tipo === filterValue);
    }
  }


}
