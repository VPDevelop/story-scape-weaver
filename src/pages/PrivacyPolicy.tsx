
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="py-8 px-2 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose prose-sm md:prose-base max-w-none">
        <p className="text-muted-foreground mb-4">Last updated: May 18, 2025</p>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
          <p>
            LunaTales ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you use our application.
          </p>
          <p>
            Please read this privacy policy carefully. By using our application, you consent to the collection and use of information 
            in accordance with this policy.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
          <p>
            We may collect several types of information from and about users of our application, including:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Personal information you provide, such as email address and password when creating an account</li>
            <li>Child's first name and preferences when generating stories (we do not collect full names, addresses, or other identifying information about children)</li>
            <li>Usage data about how you interact with our application</li>
            <li>Device information including your web browser, IP address, time zone, and cookies</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Generate personalized stories based on your inputs</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Monitor and analyze usage patterns and trends</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">4. Children's Privacy</h2>
          <p>
            Our application is intended for use by parents and caregivers, not by children directly. We do not knowingly collect 
            personally identifiable information from children under 13. If you are a parent or guardian and believe we have collected 
            information from a child under 13, please contact us so we can promptly remove such information.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">5. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of transmission 
            over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">6. Third-Party Services</h2>
          <p>
            Our application may use third-party services that collect information about you. These services have their own privacy 
            policies addressing how they use such information.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
          <p>
            Depending on your location, you may have rights regarding your personal information, including:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>The right to access the personal information we have about you</li>
            <li>The right to request correction or deletion of your personal information</li>
            <li>The right to restrict or object to our processing of your personal information</li>
            <li>The right to data portability</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information provided below.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">8. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
            on this page and updating the "Last updated" date.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">9. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy, please contact us at privacy@lunatales.com.
          </p>
        </section>
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button asChild variant="outline">
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
