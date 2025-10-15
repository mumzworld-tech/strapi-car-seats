import type { Schema, Struct } from '@strapi/strapi';

export interface ContentAbout extends Struct.ComponentSchema {
  collectionName: 'components_content_abouts';
  info: {
    displayName: 'About';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface ContentCheckedList extends Struct.ComponentSchema {
  collectionName: 'components_content_checked_lists';
  info: {
    displayName: 'CheckedList';
  };
  attributes: {
    items: Schema.Attribute.Component<'content.list', true>;
    title: Schema.Attribute.String;
  };
}

export interface ContentCustomer extends Struct.ComponentSchema {
  collectionName: 'components_content_customers';
  info: {
    displayName: 'Customer';
  };
  attributes: {
    countryCode: Schema.Attribute.String;
    email: Schema.Attribute.Email;
    fullName: Schema.Attribute.Text;
    phone: Schema.Attribute.String;
  };
}

export interface ContentGallery extends Struct.ComponentSchema {
  collectionName: 'components_content_galleries';
  info: {
    displayName: 'Gallery';
  };
  attributes: {
    file: Schema.Attribute.Media<'images'>;
    position: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    title: Schema.Attribute.String;
  };
}

export interface ContentList extends Struct.ComponentSchema {
  collectionName: 'components_content_lists';
  info: {
    displayName: 'List';
  };
  attributes: {
    label: Schema.Attribute.String;
  };
}

export interface ContentLocation extends Struct.ComponentSchema {
  collectionName: 'components_content_locations';
  info: {
    displayName: 'Location';
  };
  attributes: {
    address: Schema.Attribute.Text;
    area: Schema.Attribute.String;
    city: Schema.Attribute.String;
    country: Schema.Attribute.Enumeration<
      [
        'United Arab Emirates',
        '\u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062A \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0645\u062A\u062D\u062F\u0629',
      ]
    >;
    latitude: Schema.Attribute.Decimal;
    longitude: Schema.Attribute.Decimal;
  };
}

export interface ContentOurProcess extends Struct.ComponentSchema {
  collectionName: 'components_content_our_processes';
  info: {
    displayName: 'OurProcess';
  };
  attributes: {
    items: Schema.Attribute.Component<'content.process-step', true>;
    title: Schema.Attribute.String;
  };
}

export interface ContentProcessStep extends Struct.ComponentSchema {
  collectionName: 'components_content_process_steps';
  info: {
    displayName: 'ProcessStep';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface ContentServiceItem extends Struct.ComponentSchema {
  collectionName: 'components_content_service_items';
  info: {
    displayName: 'ServiceItem';
  };
  attributes: {
    currency: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    price: Schema.Attribute.Decimal;
    serviceItemList: Schema.Attribute.Component<'content.list', true>;
    title: Schema.Attribute.String;
  };
}

export interface ContentServices extends Struct.ComponentSchema {
  collectionName: 'components_content_services';
  info: {
    displayName: 'Services';
  };
  attributes: {
    serviceItems: Schema.Attribute.Component<'content.service-item', true>;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'content.about': ContentAbout;
      'content.checked-list': ContentCheckedList;
      'content.customer': ContentCustomer;
      'content.gallery': ContentGallery;
      'content.list': ContentList;
      'content.location': ContentLocation;
      'content.our-process': ContentOurProcess;
      'content.process-step': ContentProcessStep;
      'content.service-item': ContentServiceItem;
      'content.services': ContentServices;
    }
  }
}
