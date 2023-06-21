import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-link-shortener',
  templateUrl: './link-shortener.component.html',
  styleUrls: ['./link-shortener.component.scss'],
})
export class LinkShortenerComponent {
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  btnStyle = 'btn-default';
  btnClicked = false;
  btnVal = 'Copy';
  count: number = 0;
  isValid: boolean = true;
  txtLink: string = '';
  shortLink: any;
  shortLinkError: any;
  links: any = [];

  copy(link: any) {
    if (this.btnStyle == 'btn-clicked') {
      navigator.clipboard.writeText(link.shortLink);
      this.toastr.success(
        link.shortLink + ' Copied to clipboard',
        'Link Copied: Success'
      );
    } else {
      this.btnStyle = 'btn-clicked';
      this.btnVal = 'Copied!';
      console.log(link);
      navigator.clipboard.writeText(link.shortLink);
      this.toastr.success(
        link.shortLink + ' Copied to clipboard',
        'Link Copied: Success'
      );
    }
  }

  getAPIshortLink(link: string) {
    const url = `https://api.shrtco.de/v2/shorten?url=${link}`;
    this.http.get(url).subscribe(
      (res) => {
        this.shortLink = res;
        console.log(this.shortLink.result);
        console.log(this.links);
        this.addLink(
          this.shortLink.result.original_link,
          this.shortLink.result.full_short_link
        );
        this.count++;
      },
      (error) => {
        this.shortLinkError = error;
        console.log(this.shortLinkError);
        this.toastr.error(
          this.shortLinkError.error.error,
          'Invalid Input ERROR:' + this.shortLinkError.error.error_code,
          {}
        );
      }
    );
  }

  addLink(longLink: string, shortLink: string) {
    const newLink = { longLink: longLink, shortLink: shortLink };
    this.links.push(newLink);
  }

  shorten() {
    if (this.txtLink !== '') {
      this.isValid = true;
      console.log('true');
      this.getAPIshortLink(this.txtLink);
    } else {
      this.isValid = false;
      console.log('false');
    }
  }
}
